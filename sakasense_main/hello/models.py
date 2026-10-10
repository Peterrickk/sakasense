from django.db import models
from django.contrib.auth.models import User


class Farm(models.Model):
    class FarmType(models.TextChoices):
        RURAL_FIELD = "rural_field", "Rural field"
        URBAN_CONTAINER = "urban_container", "Urban container"

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="farms")
    name = models.CharField(max_length=120)
    location = models.CharField(max_length=200)
    farm_type = models.CharField(max_length=32, choices=FarmType.choices, default=FarmType.RURAL_FIELD)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name


class Plot(models.Model):
    class Status(models.TextChoices):
        HEALTHY = "healthy", "Healthy"
        NEEDS_ATTENTION = "needs_attention", "Needs Attention"
        ACTION_REQUIRED = "action_required", "Action Required"

    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name="plots")
    name = models.CharField(max_length=120)
    crop_current = models.CharField(max_length=80, blank=True)
    area_label = models.CharField(max_length=80, blank=True)
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.HEALTHY)

    def __str__(self) -> str:
        return f"{self.farm.name} / {self.name}"


class Device(models.Model):
    class Status(models.TextChoices):
        ONLINE = "online", "Online"
        OFFLINE = "offline", "Offline"
        SYNCING = "syncing", "Syncing"

    plot = models.ForeignKey(
        Plot, on_delete=models.SET_NULL, null=True, blank=True, related_name="devices"
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="devices")
    serial_number = models.CharField(max_length=64, unique=True)
    model = models.CharField(max_length=64, default="ESP32-SakaSense-v2")
    last_seen_at = models.DateTimeField(null=True, blank=True)
    battery_percent = models.PositiveSmallIntegerField(default=100)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.OFFLINE)

    def __str__(self) -> str:
        return self.serial_number


class SensorReading(models.Model):
    class Source(models.TextChoices):
        LIVE = "live", "Live"
        SYNCED_SD_CARD = "synced_sd_card", "Synced SD card"

    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="readings")
    plot = models.ForeignKey(Plot, on_delete=models.CASCADE, related_name="readings", null=True, blank=True)
    timestamp = models.DateTimeField()
    ph = models.FloatField()
    n = models.FloatField()
    p = models.FloatField()
    k = models.FloatField()
    source = models.CharField(max_length=32, choices=Source.choices, default=Source.LIVE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["plot", "timestamp"]),
            models.Index(fields=["device", "timestamp"]),
        ]
        ordering = ["-timestamp"]


class Recommendation(models.Model):
    plot = models.ForeignKey(Plot, on_delete=models.CASCADE, related_name="recommendations")
    timestamp = models.DateTimeField()
    ranked_crops = models.JSONField(default=list)
    guidebook_code = models.CharField(max_length=4)
    fertilizer_prescription = models.JSONField(default=dict)
    insight = models.TextField(blank=True)
    generated_on_device = models.BooleanField(default=True)

    class Meta:
        ordering = ["-timestamp"]


class Alert(models.Model):
    class AlertType(models.TextChoices):
        DEFICIENCY = "deficiency", "Deficiency"
        DEVICE_OFFLINE = "device_offline", "Device offline"
        CHECK_IN_DUE = "check_in_due", "Check-in due"

    plot = models.ForeignKey(Plot, on_delete=models.CASCADE, related_name="alerts")
    alert_type = models.CharField(max_length=32, choices=AlertType.choices)
    message = models.CharField(max_length=255)
    triggered_at = models.DateTimeField()
    resolved_at = models.DateTimeField(null=True, blank=True)
    channel_sent = models.JSONField(default=list)


class Subscription(models.Model):
    class Tier(models.TextChoices):
        FREE = "free", "Free"
        FARMER_PRO = "farmer_pro", "Farmer Pro"
        COOPERATIVE = "cooperative", "Cooperative"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        PAST_DUE = "past_due", "Past due"
        CANCELED = "canceled", "Canceled"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="subscription")
    tier = models.CharField(max_length=32, choices=Tier.choices, default=Tier.FREE)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.ACTIVE)
    renewal_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=80, blank=True)


class GuidebookEntry(models.Model):
    code = models.CharField(max_length=4, unique=True)
    crop = models.CharField(max_length=80)
    soil_condition = models.CharField(max_length=200)
    cultivation_steps = models.JSONField(default=list)
    fertilizer_notes = models.TextField()

    def __str__(self) -> str:
        return f"{self.code} — {self.crop}"

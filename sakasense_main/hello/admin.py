from django.contrib import admin

from .models import (
    Alert,
    Device,
    Farm,
    GuidebookEntry,
    Plot,
    Recommendation,
    SensorReading,
    Subscription,
)

admin.site.register(Farm)
admin.site.register(Plot)
admin.site.register(Device)
admin.site.register(SensorReading)
admin.site.register(Recommendation)
admin.site.register(Alert)
admin.site.register(Subscription)
admin.site.register(GuidebookEntry)

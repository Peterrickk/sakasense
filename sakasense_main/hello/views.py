import json
from datetime import datetime

from django.http import JsonResponse, HttpRequest
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Device, Recommendation, SensorReading, Farm, Plot


def _parse_ts(value: str | None) -> datetime:
    if not value:
        return timezone.now()
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if timezone.is_naive(dt):
            return timezone.make_aware(dt, timezone.get_current_timezone())
        return dt
    except ValueError:
        return timezone.now()


@csrf_exempt
@require_http_methods(["POST"])
def device_ingest(request: HttpRequest):
    """
    ESP32 / mobile sync endpoint.

    POST /api/device/ingest/
    {
      "serial_number": "KS-ESP32-004821",
      "battery_percent": 86,
      "readings": [
        {
          "timestamp": "2026-07-21T02:00:00Z",
          "pH": 6.4, "N": 72, "P": 38, "K": 68,
          "source": "live"
        }
      ],
      "recommendation": {
        "timestamp": "2026-07-21T02:00:00Z",
        "ranked_crops": [{"crop": "Potato", "score": 92}],
        "guidebook_code": "5001",
        "fertilizer_prescription": {"product": "12-12-17", "amount": "2 bags", "timing": "7 days", "notes": ""},
        "insight": "...",
        "generated_on_device": true
      }
    }
    """
    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    serial = (payload.get("serial_number") or "").strip()
    if not serial:
        return JsonResponse({"error": "serial_number required"}, status=400)

    try:
        device = Device.objects.select_related("plot").get(serial_number=serial)
    except Device.DoesNotExist:
        return JsonResponse({"error": "Unknown device serial"}, status=404)

    device.battery_percent = int(payload.get("battery_percent", device.battery_percent))
    device.last_seen_at = timezone.now()
    device.status = Device.Status.ONLINE
    device.save(update_fields=["battery_percent", "last_seen_at", "status"])

    created = 0
    for item in payload.get("readings") or []:
        # Only create reading if device has a plot assigned
        if device.plot_id:
            SensorReading.objects.create(
                device=device,
                plot=device.plot,
                timestamp=_parse_ts(item.get("timestamp")),
                ph=float(item.get("pH", item.get("ph", 0))),
                n=float(item.get("N", item.get("n", 0))),
                p=float(item.get("P", item.get("p", 0))),
                k=float(item.get("K", item.get("k", 0))),
                source=item.get("source") or SensorReading.Source.LIVE,
            )
            created += 1

    rec = payload.get("recommendation")
    if rec and device.plot_id:
        Recommendation.objects.create(
            plot=device.plot,
            timestamp=_parse_ts(rec.get("timestamp")),
            ranked_crops=rec.get("ranked_crops") or [],
            guidebook_code=str(rec.get("guidebook_code") or "0000")[:4],
            fertilizer_prescription=rec.get("fertilizer_prescription") or {},
            insight=rec.get("insight") or "",
            generated_on_device=bool(rec.get("generated_on_device", True)),
        )

    return JsonResponse(
        {
            "ok": True,
            "device": device.serial_number,
            "readings_stored": created,
            "plot_id": device.plot_id,
        }
    )


@require_http_methods(["GET"])
def dashboard(_request: HttpRequest):
    """
    Dashboard endpoint that returns farm, plot, and summary data.
    GET /api/dashboard/
    """
    # Get all farms
    farms = []
    for farm in Farm.objects.all():
        farms.append({
            "id": str(farm.id),
            "ownerUserId": str(farm.owner_id),
            "name": farm.name,
            "location": farm.location,
            "type": farm.farm_type,
            # Adding lat/lng/altitude if they exist in the model
            # Since they don't exist in the current model, we'll use defaults
            "lat": 0.0,
            "lng": 0.0,
            "altitude": 0,
        })

    # Get all plots
    plots = []
    for plot in Plot.objects.all():
        plots.append({
            "id": str(plot.id),
            "farmId": str(plot.farm_id),
            "name": plot.name,
            "cropCurrent": plot.crop_current,
            "areaLabel": plot.area_label,
            "status": plot.status,
            # Adding layout and offsets if they exist in the model
            # Since they don't exist in the current model, we'll use defaults
            "layout": {"col": 1, "row": 1, "colSpan": 1, "rowSpan": 1},
            "latOffset": 0.0,
            "lngOffset": 0.0,
        })

    # Build summary for each plot
    summary = []
    for plot in Plot.objects.all():
        farm = Farm.objects.get(id=plot.farm_id)

        # Get latest reading for this plot
        latest_reading = None
        try:
            reading = SensorReading.objects.filter(plot=plot).order_by('-timestamp').first()
            if reading:
                latest_reading = {
                    "id": str(reading.id),
                    "deviceId": str(reading.device_id) if hasattr(reading.device, 'id') else str(reading.device),
                    "plotId": str(reading.plot_id),
                    "timestamp": reading.timestamp.isoformat() if reading.timestamp else None,
                    "pH": float(reading.ph),
                    "N": float(reading.n),
                    "P": float(reading.p),
                    "K": float(reading.k),
                    "source": reading.source if hasattr(reading, 'source') else "live",
                }
        except Exception:
            latest_reading = None

        # Get latest recommendation for this plot
        latest_recommendation = None
        try:
            recommendation = Recommendation.objects.filter(plot=plot).order_by('-timestamp').first()
            if recommendation:
                latest_recommendation = {
                    "id": str(recommendation.id),
                    "plotId": str(recommendation.plot_id),
                    "timestamp": recommendation.timestamp.isoformat() if recommendation.timestamp else None,
                    "rankedCrops": recommendation.ranked_crops if hasattr(recommendation, 'ranked_crops') else [],
                    "guidebookCode": recommendation.guidebook_code if hasattr(recommendation, 'guidebook_code') else "0000",
                    "fertilizer": recommendation.fertilizer_prescription if hasattr(recommendation, 'fertilizer_prescription') else {},
                    "insight": recommendation.insight if hasattr(recommendation, 'insight') else "",
                    "generatedOnDevice": recommendation.generated_on_device if hasattr(recommendation, 'generated_on_device') else True,
                }
        except Exception:
            latest_recommendation = None

        summary.append({
            "plot": {
                "id": str(plot.id),
                "farmId": str(plot.farm_id),
                "name": plot.name,
                "cropCurrent": plot.crop_current,
                "areaLabel": plot.area_label,
                "status": plot.status,
                "layout": {"col": 1, "row": 1, "colSpan": 1, "rowSpan": 1},
                "latOffset": 0.0,
                "lngOffset": 0.0,
            },
            "latestReading": latest_reading,
            "recommendation": latest_recommendation,
            "farm": {
                "id": str(farm.id),
                "ownerUserId": str(farm.owner_id),
                "name": farm.name,
                "location": farm.location,
                "type": farm.farm_type,
                "lat": 0.0,
                "lng": 0.0,
                "altitude": 0,
            },
        })

    # Get total reading count
    reading_count = SensorReading.objects.count()

    return JsonResponse({
        "farms": farms,
        "plots": plots,
        "summary": summary,
        "readingCount": reading_count,
    })


@require_http_methods(["GET"])
def health(_request: HttpRequest):
    return JsonResponse({"service": "sakasense-api", "status": "ok"})

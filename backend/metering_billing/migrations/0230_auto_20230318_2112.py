# Generated by Django 4.0.5 on 2023-03-18 21:12

from django.db import migrations


def transfer_filters_to_subscription_filters(apps, schema_editor):
    SubscriptionRecord = apps.get_model("metering_billing", "SubscriptionRecord")
    for subscription in SubscriptionRecord.objects.all():
        new_filters = []
        for sf in subscription.filters.all():
            property_name = sf.property_name
            value = sf.comparison_value[0]
            new_filters.append([property_name, value])
        subscription.subscription_filters = new_filters
        subscription.save()


class Migration(migrations.Migration):
    dependencies = [
        (
            "metering_billing",
            "0229_historicalsubscriptionrecord_subscription_filters_and_more",
        ),
    ]

    operations = [
        migrations.RunPython(transfer_filters_to_subscription_filters),
    ]

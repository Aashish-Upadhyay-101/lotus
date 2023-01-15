# Generated by Django 4.0.5 on 2023-01-09 04:31

from django.db import migrations, models
import metering_billing.utils.utils


class Migration(migrations.Migration):

    dependencies = [
        ('metering_billing', '0144_alter_historicalmetric_metric_type_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='historicalorganizationsetting',
            name='setting_value',
        ),
        migrations.RemoveField(
            model_name='organizationsetting',
            name='setting_value',
        ),
        migrations.AlterField(
            model_name='historicalorganizationsetting',
            name='setting_id',
            field=models.SlugField(default=metering_billing.utils.utils.random_uuid, max_length=100),
        ),
        migrations.AlterField(
            model_name='historicalorganizationsetting',
            name='setting_values',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='organizationsetting',
            name='setting_id',
            field=models.SlugField(default=metering_billing.utils.utils.random_uuid, max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='organizationsetting',
            name='setting_values',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
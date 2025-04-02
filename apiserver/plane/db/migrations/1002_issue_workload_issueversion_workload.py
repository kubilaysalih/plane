# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0092_alter_deprecateddashboardwidget_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='issue',
            name='workload',
            field=models.CharField(blank=True, choices=[
                ("30m", "30 minutes"),
                ("1h", "1 hour"),
                ("2h", "2 hours"),
                ("3h", "3 hours"),
                ("4h", "4 hours"),
                ("6h", "6 hours"),
                ("8h", "8 hours"),
                ("1d", "1 day"),
                ("1.5d", "1.5 days"),
                ("2d", "2 days"),
                ("3d", "3 days"),
                ("4d", "4 days"),
                ("5d", "5 days"),
                ("1w", "1 week"),
                ("2w", "2 weeks"),
                ("3w", "3 weeks"),
                ("1m", "1 month"),
                ("1.5m", "1.5 months"),
                ("2m", "2 months"),
                ("3m", "3 months"),
                ("4m", "4 months"),
                ("5m", "5 months"),
                ("6m", "6 months"),
                ("9m", "9 months"),
                ("1y", "1 year"),
            ], max_length=30, null=True, verbose_name='Issue Workload'),
        ),
        migrations.AddField(
            model_name='issueversion',
            name='workload',
            field=models.CharField(blank=True, choices=[
                ("30m", "30 minutes"),
                ("1h", "1 hour"),
                ("2h", "2 hours"),
                ("3h", "3 hours"),
                ("4h", "4 hours"),
                ("6h", "6 hours"),
                ("8h", "8 hours"),
                ("1d", "1 day"),
                ("1.5d", "1.5 days"),
                ("2d", "2 days"),
                ("3d", "3 days"),
                ("4d", "4 days"),
                ("5d", "5 days"),
                ("1w", "1 week"),
                ("2w", "2 weeks"),
                ("3w", "3 weeks"),
                ("1m", "1 month"),
                ("1.5m", "1.5 months"),
                ("2m", "2 months"),
                ("3m", "3 months"),
                ("4m", "4 months"),
                ("5m", "5 months"),
                ("6m", "6 months"),
                ("9m", "9 months"),
                ("1y", "1 year"),
            ], max_length=30, null=True, verbose_name='Issue Workload'),
        ),
    ]
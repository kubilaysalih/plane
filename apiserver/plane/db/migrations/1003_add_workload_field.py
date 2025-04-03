# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db', '1002_issue_workload_issueversion_workload'),
    ]

    operations = [
        # The workload columns are already added in migration 1002_issue_workload_issueversion_workload
        # This migration is now a no-op to avoid the "column already exists" error
        migrations.RunSQL(
            sql="""
            -- No operation needed as columns are already added in previous migration
            SELECT 1;
            """,
            reverse_sql="""
            -- No operation needed
            SELECT 1;
            """
        ),
    ]

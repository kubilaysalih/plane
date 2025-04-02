# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0093_issue_workload_issueversion_workload'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            ALTER TABLE issues ADD COLUMN IF NOT EXISTS workload VARCHAR(30) NULL;
            ALTER TABLE issue_versions ADD COLUMN IF NOT EXISTS workload VARCHAR(30) NULL;
            """,
            reverse_sql="""
            ALTER TABLE issues DROP COLUMN IF EXISTS workload;
            ALTER TABLE issue_versions DROP COLUMN IF EXISTS workload;
            """
        ),
    ]

# Generated by Django 4.0.6 on 2022-08-07 09:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medicines', '0009_alter_drug_drugusage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='drug',
            name='drugusage',
            field=models.TextField(blank=True, max_length=10000, null=True),
        ),
    ]

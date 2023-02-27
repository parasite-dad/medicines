# Generated by Django 4.0.6 on 2022-08-08 06:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('medicines', '0012_alter_precription_patientrecordtime'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='precription',
            name='patientrecordtime',
        ),
        migrations.CreateModel(
            name='DrugTakingTime',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('drugtakingdate', models.DateField()),
                ('patienttakingtime', models.DateTimeField(blank=True, null=True)),
                ('consultationid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='medicines.consultation')),
            ],
        ),
    ]
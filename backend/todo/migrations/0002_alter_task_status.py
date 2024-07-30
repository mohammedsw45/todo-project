# Generated by Django 4.2.14 on 2024-07-30 06:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='status',
            field=models.CharField(choices=[('To Do', 'To Do'), ('In Progress', 'In Progress'), ('Done', 'Done'), ('Cancelled', 'Cancelled')], default='To Do', max_length=20),
        ),
    ]

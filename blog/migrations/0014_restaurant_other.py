# Generated by Django 2.2.1 on 2019-08-22 23:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0013_restaurant_region'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='other',
            field=models.TextField(default='0'),
        ),
    ]

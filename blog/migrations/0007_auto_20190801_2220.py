# Generated by Django 2.2.1 on 2019-08-01 22:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0006_auto_20190731_2049'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='isCheap',
            field=models.TextField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='restaurant',
            name='seating',
            field=models.TextField(default=0),
            preserve_default=False,
        ),
    ]

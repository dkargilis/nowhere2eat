# Generated by Django 2.2.1 on 2019-07-25 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='crossroads',
            field=models.TextField(default=2),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='restaurant',
            name='genre',
            field=models.TextField(default='none'),
            preserve_default=False,
        ),
    ]

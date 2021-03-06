# Generated by Django 2.2.1 on 2020-04-23 00:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0022_auto_20190825_2117'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='link',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='crossroads',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='genre',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='price',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='region',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='seating',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='vegetarianOptions',
            field=models.TextField(default=''),
        ),
    ]

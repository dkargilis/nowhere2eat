# Generated by Django 2.2.1 on 2019-08-09 14:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0009_filters_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='filters',
            name='title',
            field=models.CharField(max_length=100),
        ),
    ]

# Generated by Django 2.2.1 on 2019-08-25 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0020_auto_20190825_1926'),
    ]

    operations = [
        migrations.AddField(
            model_name='filters',
            name='filterUsernamesVotedUp',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='filters',
            name='filtersUsernamesVotedDown',
            field=models.TextField(default=''),
        ),
    ]

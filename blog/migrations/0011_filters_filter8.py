# Generated by Django 2.2.1 on 2019-08-09 14:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0010_auto_20190809_1428'),
    ]

    operations = [
        migrations.AddField(
            model_name='filters',
            name='filter8',
            field=models.CharField(default='f', max_length=5),
            preserve_default=False,
        ),
    ]

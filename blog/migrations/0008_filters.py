# Generated by Django 2.2.1 on 2019-08-09 01:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0007_auto_20190801_2220'),
    ]

    operations = [
        migrations.CreateModel(
            name='filters',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filter1', models.CharField(max_length=5)),
                ('filter2', models.CharField(max_length=5)),
                ('filter3', models.CharField(max_length=5)),
                ('filter4', models.CharField(max_length=5)),
                ('filter5', models.CharField(max_length=5)),
                ('filter6', models.CharField(max_length=5)),
                ('filter7', models.CharField(max_length=5)),
            ],
        ),
    ]

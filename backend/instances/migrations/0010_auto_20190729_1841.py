# Generated by Django 2.2.3 on 2019-07-29 18:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('instances', '0009_auto_20190729_1731'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='instance',
            name='installed',
        ),
        migrations.RemoveField(
            model_name='revision',
            name='compiled',
        ),
    ]

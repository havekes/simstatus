# Generated by Django 2.2.3 on 2019-07-28 22:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('instances', '0006_auto_20190728_0602'),
    ]

    operations = [
        migrations.AlterField(
            model_name='revision',
            name='alias',
            field=models.TextField(null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='revision',
            name='r',
            field=models.IntegerField(unique=True),
        ),
    ]

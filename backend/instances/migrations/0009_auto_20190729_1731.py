# Generated by Django 2.2.3 on 2019-07-29 17:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('instances', '0008_instance_installed'),
    ]

    operations = [
        migrations.AddField(
            model_name='instance',
            name='pid',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='instance',
            name='lang',
            field=models.TextField(default='en', max_length=2),
        ),
    ]

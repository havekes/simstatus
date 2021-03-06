# Generated by Django 2.2.3 on 2019-07-28 06:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('instances', '0005_auto_20190727_1629'),
    ]

    operations = [
        migrations.CreateModel(
            name='Revision',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('r', models.IntegerField()),
                ('alias', models.TextField()),
                ('compiled', models.BooleanField(default=False)),
            ],
        ),
        migrations.AlterField(
            model_name='instance',
            name='lang',
            field=models.CharField(default='en', max_length=2),
        ),
        migrations.AlterField(
            model_name='instance',
            name='port',
            field=models.IntegerField(default=13353, unique=True),
        ),
        migrations.AlterField(
            model_name='instance',
            name='revision',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='instances.Revision'),
        ),
    ]

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userservice', '0003_place'),
    ]

    operations = [
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sender_id', models.IntegerField()),
                ('recipient_id', models.IntegerField()),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('read', models.BooleanField(default=False)),
            ],
        ),
        migrations.AddIndex(
            model_name='message',
            index=models.Index(fields=['sender_id', 'recipient_id'], name='userservic_sender__a6b2f1_idx'),
        ),
        migrations.AddIndex(
            model_name='message',
            index=models.Index(fields=['recipient_id', 'read'], name='userservic_recipient__c7d1e3_idx'),
        ),
    ]


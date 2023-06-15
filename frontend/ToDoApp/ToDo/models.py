from django.db import models


class ToDo(models.Model):
    task = models.CharField(max_length=300)
    status = models.BooleanField(
        default=False,
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.task

    class Meta:
        verbose_name = "Task"
        verbose_name_plural = "Tasks"



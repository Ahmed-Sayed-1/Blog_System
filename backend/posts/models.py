from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Post(models.Model) : 
    title = models.CharField(max_length=200)
    date = models.DateField()
    content=models.CharField(max_length=500)
    image_url = models.CharField(max_length=255, blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Posts")
    
    def __str__(self):                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
        return self.title
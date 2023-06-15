from django.shortcuts import get_object_or_404
from .models import ToDo
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .serializers import ToDoSerializer
from rest_framework.decorators import api_view


@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'List': '/task-list/',
        'Detail View': '/task-detail/<str:pk>/',
        'Create': '/task-create/',
        'Update': '/task-update/<str:pk>/',
        'Delete': '/task-delete/<str:pk>/',
    }
    return Response(api_urls)


@api_view(['GET'])
def taskList(request):
    tasks = ToDo.objects.all().order_by('-id')
    serializer = ToDoSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def taskDetail(request, pk):
    tasks = ToDo.objects.get(id=pk)
    serializer = ToDoSerializer(tasks, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def taskCreate(request):
    serializer = ToDoSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['POST'])
def taskUpdate(request, pk):
    task = ToDo.objects.get(id=pk)
    serializer = ToDoSerializer(instance=task, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['DELETE'])
def taskDelete(request, pk):
    task = ToDo.objects.get(id=pk)
    task.delete()

    return Response('Item succsesfully delete!')

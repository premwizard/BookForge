import os
from celery import Celery
from kombu import Queue, Exchange
from app.core.config import settings

celery_app = Celery(
    "worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

# Define Exchanges and Queues
default_exchange = Exchange('default', type='direct')
celery_app.conf.task_queues = (
    Queue('main-queue', default_exchange, routing_key='default'),
    Queue('priority', default_exchange, routing_key='priority'),
    Queue('publisher', default_exchange, routing_key='publisher'),
    Queue('org', default_exchange, routing_key='org'),
    Queue('worker', default_exchange, routing_key='worker'),
    Queue('gpu', default_exchange, routing_key='gpu'),
    Queue('cpu', default_exchange, routing_key='cpu'),
    Queue('large_doc', default_exchange, routing_key='large_doc'),
    Queue('dlq', default_exchange, routing_key='dlq'), # Dead Letter Queue
)
celery_app.conf.task_default_queue = 'main-queue'
celery_app.conf.task_default_exchange = 'default'
celery_app.conf.task_default_routing_key = 'default'

celery_app.conf.task_routes = {
    "app.workers.tasks.*": {"queue": "main-queue"},
    "app.workers.workflow_tasks.execute_node_task": {"queue": "worker"},
    "app.workers.workflow_tasks.monitor_workflow_task": {"queue": "priority"},
    "app.workers.workflow_tasks.checkpoint_task": {"queue": "priority"},
}

# Ensure timezone is consistent
celery_app.conf.timezone = 'UTC'

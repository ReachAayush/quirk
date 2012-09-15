import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__),'quirk')))
os.environ['DJANGO_SETTINGS_MODULE'] = 'quirk.settings'
import django.core.handlers.wsgi
#application = django.core.handlers.wsgi.WSGIHandler()

class ForcePostHandler(django.core.handlers.wsgi.WSGIHandler):
    def get_response(self, request):
        request.POST # force reading of POST data
        return super(ForcePostHandler, self).get_response(request)

application = ForcePostHandler()
from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/newtask/$', 'quirk.quirkapp.views.new_task'),
    url(r'^api/getTask/(?P<public_key>[a-zA-Z0-9_.-]+)/$', 'quirk.quirkapp.views.getTask'),
    url(r'^api/(?P<public_key>[a-zA-Z0-9_.-]+)/newresponse/$', 'quirk.quirkapp.views.new_response'),
    url(r'^api/(?P<private_key>[a-zA-Z0-9_.-]+)/getresponses/$', 'quirk.quirkapp.views.getResponses'),
    url(r'^newtask/$', 'quirk.quirkapp.views.newTask'),
    url(r'^(?P<public_key>[a-zA-Z0-9_.-]+)/$', 'quirk.quirkapp.views.mobileView'),
    url(r'^(?P<private_key>[a-zA-Z0-9_.-]+)/$', 'quirk.quirkapp.views.analytics'),
    url(r'^$', 'quirk.quirkapp.views.home'),
)

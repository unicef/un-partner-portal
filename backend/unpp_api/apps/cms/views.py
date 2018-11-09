from django.views.generic import TemplateView


class LandingPage(TemplateView):
    template_name = 'index.html'


class AboutPage(TemplateView):
    template_name = 'about.html'


class PartnerPage(TemplateView):
    template_name = 'partner-opportunities.html'


class RegistrationPage(TemplateView):
    template_name = 'registration.html'

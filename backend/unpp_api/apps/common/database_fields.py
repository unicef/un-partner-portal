from __future__ import unicode_literals

from django.contrib.postgres.fields import ArrayField
from django.db.models import Field
from django import forms
from django.utils import six
from django.utils.encoding import smart_text


class FixedTextField(Field):
    description = "Text"

    def get_internal_type(self):
        return "TextField"

    def to_python(self, value):
        if isinstance(value, six.string_types) or value is None:
            return value
        return smart_text(value)

    def get_prep_value(self, value):
        value = super(FixedTextField, self).get_prep_value(value)
        return self.to_python(value)

    def formfield(self, **kwargs):
        # Passing max_length to forms.CharField means that the value's length
        # will be validated twice. This is considered acceptable since we want
        # the value in the form field (to pass into widget for example).
        defaults = {'max_length': self.max_length}
        if not self.choices:
            defaults['widget'] = forms.Textarea
        defaults.update(kwargs)
        return super(FixedTextField, self).formfield(**defaults)


class ChoiceArrayField(ArrayField):
    """
    A field that allows us to store an array of choices.
    Uses Django's Postgres ArrayField
    and a MultipleChoiceField for its formfield.
    """

    def formfield(self, **kwargs):
        defaults = {
            'form_class': forms.MultipleChoiceField,
            'choices': self.base_field.choices,
        }
        defaults.update(kwargs)
        return super(ArrayField, self).formfield(**defaults)

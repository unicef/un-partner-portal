from rest_framework import status as statuses
from rest_framework.response import Response
from rest_framework.validators import UniqueTogetherValidator


class PatchOneFieldErrorMixin(object):

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if not serializer.is_valid():
            return Response(
                {
                    # TODO: Why doesn't this properly handle nested errors
                    'non_field_errors': [
                        "Errors in field(s): [{}]".format(", ".join(serializer.errors.keys()))
                    ],
                    'full_non_field_errors': serializer.errors
                },
                status=statuses.HTTP_400_BAD_REQUEST
            )

        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class SkipUniqueTogetherValidationOnPatchMixin(object):

    def get_validators(self):
        validators = super(SkipUniqueTogetherValidationOnPatchMixin, self).get_validators()
        request = self.context.get('request')
        view = self.context.get('view')

        # Do not validate unique_together on patch requests when serializer is nested
        if request and request.method == 'PATCH' and view and view.get_serializer_class() != self.__class__:
            validators = filter(
                lambda validator: validator.__class__ != UniqueTogetherValidator,
                validators
            )

        return validators


class CreateOnlyFieldsMixin(object):

    def update(self, instance, validated_data):
        if self.Meta.create_only_fields == '__all__':
            validated_data = {}
        elif self.Meta.create_only_fields:
            for field_name in self.Meta.create_only_fields:
                validated_data.pop(field_name, None)
        return super(CreateOnlyFieldsMixin, self).update(instance, validated_data)

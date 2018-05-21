
class ActivePartnerIDDefault(object):
    def set_context(self, serializer_field):
        print('DEFULT')
        print(serializer_field.context['request'])
        self.active_partner = serializer_field.context['request'].active_partner

    def __call__(self):
        return getattr(self.active_partner, 'id', None)

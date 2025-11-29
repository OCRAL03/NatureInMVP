class SoftDeleteMixin:
    """
    Mixin para borrado lógico.

    Requiere que el modelo tenga campo booleano `is_active`.
    No genera migraciones aquí; úsalo en modelos que ya lo tengan.
    """

    def soft_delete(self):
        if not hasattr(self, "is_active"):
            raise AttributeError("El modelo no define 'is_active'.")
        self.is_active = False
        # Nota: persistencia debe realizarse por el consumidor (self.save())
        return self


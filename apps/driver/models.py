from django.db import models

class DriverProfile(models.Model):
    first_name = models.CharField(max_length=100, default='MAX')
    last_name = models.CharField(max_length=100, default='VERSTAPPEN')
    racing_number = models.PositiveIntegerField(default=1)
    permanent_number = models.PositiveIntegerField(default=33)
    team = models.CharField(max_length=150, default='Oracle Red Bull Racing')
    nationality = models.CharField(max_length=100, default='Dutch')
    birth_date = models.DateField(default='1997-09-30')
    birth_place = models.CharField(max_length=150, default='Hasselt, Belgium')
    residence = models.CharField(max_length=150, default='Monte Carlo, Monaco')
    
    quote = models.CharField(
        max_length=255,
        default='Every lap is a test. Not just of the car, but of myself.'
    )
    intro_statement = models.CharField(
        max_length=255,
        default='For me, racing is about more than chasing speed — it’s about chasing my absolute limits.'
    )
    biography_intro = models.TextField(
        default='Max Verstappen was born into motorsport heritage, but his historic trajectory was forged through ironclad dedication, unflinching precision, and an instinctive race craft that redefined Formula 1 standards.'
    )
    biography_full = models.TextField(
        default='From making history as the youngest driver ever to start an F1 Grand Prix at just 17 years old to commanding four consecutive Formula 1 World Championships, Max Verstappen embodies the pinnacle of modern motorsport engineering and driver focus.'
    )
    
    # Visuals
    portrait_image = models.ImageField(upload_to='driver/portrait/', blank=True, null=True)
    action_image = models.ImageField(upload_to='driver/action/', blank=True, null=True)
    helmet_image = models.ImageField(upload_to='driver/helmet/', blank=True, null=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Driver Profile'
        verbose_name_plural = 'Driver Profile'

    def __str__(self):
        return f"{self.first_name} {self.last_name} (#{self.racing_number})"

    @classmethod
    def get_active_profile(cls):
        profile = cls.objects.filter(is_active=True).first()
        if not profile:
            profile = cls.objects.create()
        return profile

class DriverStatistic(models.Model):
    title = models.CharField(max_length=100, help_text="e.g., WORLD CHAMPIONSHIPS")
    value = models.IntegerField(help_text="Numeric target value for GSAP counter")
    prefix = models.CharField(max_length=10, blank=True, default='')
    suffix = models.CharField(max_length=10, blank=True, default='+', help_text="e.g. + or %")
    description = models.CharField(max_length=255, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order']
        verbose_name = 'Driver Statistic'
        verbose_name_plural = 'Driver Statistics'

    def __str__(self):
        return f"{self.prefix}{self.value}{self.suffix} {self.title}"

class DriverPillar(models.Model):
    title = models.CharField(max_length=100, help_text="e.g., THE DRIVER, THE MINDSET")
    subtitle = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    image = models.ImageField(upload_to='driver/pillars/', blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order']
        verbose_name = 'Editorial Pillar'
        verbose_name_plural = 'Editorial Pillars'

    def __str__(self):
        return self.title

from django.test import TestCase, Client
from django.urls import reverse
from apps.news.models import NewsArticle

class VerstappenWebsiteTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_pages_status_codes(self):
        pages = ['home', 'about', 'career', 'races', 'gallery', 'news_list', 'contact', 'robots_txt']
        for page in pages:
            response = self.client.get(reverse(page))
            self.assertEqual(response.status_code, 200, f"Page {page} failed with status {response.status_code}")

    def test_next_race_api(self):
        response = self.client.get(reverse('api_next_race'))
        self.assertIn(response.status_code, [200, 404])

    def test_stats_api(self):
        response = self.client.get(reverse('api_stats'))
        self.assertEqual(response.status_code, 200)

    def test_contact_api_submission(self):
        payload = {
            'first_name': 'Lewis',
            'last_name': 'Hamilton',
            'email': 'lewis@mercedes-amg.com',
            'subject': 'general',
            'message': 'Great race in Brazil Max. Respect.'
        }
        response = self.client.post(
            reverse('api_contact_submit'),
            data=payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

    def test_contact_honeypot_blocking(self):
        payload = {
            'first_name': 'Bot',
            'last_name': 'Spammer',
            'email': 'spam@bot.com',
            'subject': 'general',
            'message': 'Spam message',
            'bot_catcher': 'I am a spam bot'
        }
        response = self.client.post(
            reverse('api_contact_submit'),
            data=payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

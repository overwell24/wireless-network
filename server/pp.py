import unittest
from app import create_app, db
from models import Cafe, Location

class ApiTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Create the test client and setup the app for testing"""
        cls.app = create_app()  # Assuming you have a testing config in your app
        cls.client = cls.app.test_client()

        # Create tables for testing
        with cls.app.app_context():
            db.create_all()

    @classmethod
    def tearDownClass(cls):
        """Clean up after all tests are done"""
        with cls.app.app_context():
            db.drop_all()

    def setUp(self):
        """Setup initial data for each test"""
        with self.app.app_context():
            # Adding a Location and Cafe with dummy data
            location = Location(lat=37.7749, lng=-122.4194)
            db.session.add(location)
            db.session.commit()

            self.cafe = Cafe(cafe_name="Test Cafe", location=location, num_tables=5)
            db.session.add(self.cafe)
            db.session.commit()

    def tearDown(self):
        """Reset the database after each test"""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
            db.create_all()

    def test_get_cafes(self):
        """Test the /api/cafes endpoint"""
        response = self.client.get('/api/cafes')
        self.assertEqual(response.status_code, 200)
        self.assertIn('cafe_id', response.json[0])
        self.assertIn('cafe_name', response.json[0])
        self.assertIn('lat', response.json[0])
        self.assertIn('lng', response.json[0])

    def test_get_cafe_by_id(self):
        """Test the /api/cafes/<int:cafe_id> endpoint"""
        response = self.client.get(f'/api/cafes/{self.cafe.cafe_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['cafe_name'], 'Test Cafe')

    def test_get_cafe_not_found(self):
        """Test when cafe does not exist"""
        response = self.client.get('/api/cafes/999')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json['error'], 'Cafe not found')

    def test_update_table_occupied_status(self):
        """Test updating the table occupied status"""
        data = {
            "cafe_id": self.cafe.cafe_id,
            "table_1": 1,
            "table_2": 0
        }
        response = self.client.post('/api/cafe/table-occupied-status', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['message'], '테이블 상태가 성공적으로 업데이트되었습니다')

        # Check if the status was updated in the database
        with self.app.app_context():
            updated_cafe = Cafe.query.get(self.cafe.cafe_id)
            self.assertEqual(updated_cafe.tables_occupied_status["table_1"], 1)
            self.assertEqual(updated_cafe.tables_occupied_status["table_2"], 0)

    def test_update_table_occupied_status_missing_cafe_id(self):
        """Test when cafe_id is missing in the request"""
        data = {"table_1": 1, "table_2": 0}
        response = self.client.post('/api/cafe/table-occupied-status', json=data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['error'], "cafe_id가 누락되었습니다.")

    def test_update_table_invalid_status(self):
        """Test when an invalid table status is provided"""
        data = {
            "cafe_id": self.cafe.cafe_id,
            "table_1": 2  # Invalid status
        }
        response = self.client.post('/api/cafe/table-occupied-status', json=data)
        self.assertEqual(response.status_code, 400)
        self.assertIn("테이블 상태는 0 또는 1이어야 합니다.", response.json['error'])

if __name__ == '__main__':
    unittest.main()

from flask import Flask

app = Flask(__name__)

@app.route('/api/cafes', methods=['GET'])
def get_cafes():
    pass

@app.route('/api/cafes/<int:cafe_id>', methods=['GET'])
def get_cafe_by_id(cafe_id):
    pass

@app.route('/api/cafe/table-status', methods=['POST'])
def update_table_status():
    pass

from flask import Flask
import json
app = Flask(__name__)
from flask import jsonify #use for serialization
import executor_utils as eu

@app.route('/build_and_run',methods=['POST'])
def build_and_run():
    data = request.get_json()
    if 'code' not in data or 'lang' not in data:
        return 'need code and lang '
    code = data['code']
    lang = data['lang']

    print('api got called with code: %s in %s',(code,lang))

    result = eu.build_and_run( code, lang )
    return jsonify(result)


if __name__ == '__main__':
    eu.load_image()
    app.run(debug=True)
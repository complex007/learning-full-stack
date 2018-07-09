from flask import Flask,request,jsonify
# jsonify is used for serialization
import json
app = Flask(__name__)
import executor_utils as eu

@app.route('/build_and_run',methods=['POST'])
def build_and_run():
    print('build_and_run')

    data = request.get_json()
    if 'code' not in data or 'lang' not in data:
        return 'need code and lang '
    code = data['code']
    lang = data['lang']

    print('api got called with code: %s in %s' % (code,lang))

    result = eu.build_and_run( code, lang )
    return jsonify(result)


if __name__ == '__main__':
    import sys
    port = int(sys.argv[1])
    eu.load_image()
    app.run( port = port )
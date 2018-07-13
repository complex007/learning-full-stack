from pylint import epylint as lint
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__),'utils'))
import log 
log.setCategory('test')

def logInfo(my_obj):
    # for key in dir(my_obj):
    #     message = '{}: {}'.format(key, getattr(my_obj, key))
    log.Info(my_obj)  
    print("end")


def start():
    (pylint_stdout, pylint_stderr) = lint.py_run('service.py', return_std=True)
    logInfo(pylint_stderr.read())
    # logInfo(pylint_stderr)


if __name__ == "__main__":
    start()
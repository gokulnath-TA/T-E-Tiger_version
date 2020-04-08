from django.shortcuts import HttpResponse
import json,codecs

def Response(data, error=True,http_code=200,json_format=True):
    if error:
        status = 'ok'
    else:
        status = 'not_ok'
    response = {
        "data": data,
        "status": status,
    }
    if(json_format):
        response=json.dumps(response)

    return HttpResponse(response, content_type='Application/json',status=int(http_code))

def ParseData(request):
    if request and request.body:
        json_data = json.loads(request.body.decode('utf-8'))
        print(json_data['data'])
        try:
          return json_data['data']
        except KeyError:
            return {};
    return {};

def ParseJson(request):
    if request and request.data:
        json_data = json.loads(request.data)
        try:
          return json_data['data']
        except KeyError:
            return {};
    return {};

def SingleJsonval(data):
    array_result = serializers.serialize('json', [data], ensure_ascii=False)
    # just_object_result = array_result[1:-1]
    just_object_result = json.loads(array_result)
    return just_object_result[0]
    
def dump(data):
    return json.dumps(data)




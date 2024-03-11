import docker

def get_container_ip(container_name_or_id):
    client = docker.from_env()
    container = client.containers.get(container_name_or_id)
    return container.attrs['NetworkSettings']

container_ip = get_container_ip('salesforecastappbackendcontainer')
print("Container IP:", container_ip)
import subprocess


def run_command(command):
    chunk = subprocess.Popen(
        command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    error = str(chunk.stderr.read(), encoding='utf-8')
    if error:
        return None
    else:
        result = str(chunk.stdout.read(), encoding='utf-8')
        return result

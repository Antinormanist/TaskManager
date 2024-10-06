HTML_EMAIL_CODE_MSG = """
<p style="color: #000;">Hello, <strong>{username}</strong></p>
<p style="color: #000;">Here is your code for authentication</p>
<div style="width: 110px; height: 72px; background-color: #06101f">
    <h2 style="margin: 0; font-size: 3rem; color: #4287f5;">{code}<h2>
</div>
<p style="color: #000;">Have a good day!</p>
"""

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
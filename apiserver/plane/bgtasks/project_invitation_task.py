# Django imports
from django.core.mail import EmailMultiAlternatives, get_connection
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

# Third party imports
from celery import shared_task
from sentry_sdk import capture_exception

# Module imports
from plane.db.models import Project, User, ProjectMemberInvite
from plane.license.models import InstanceConfiguration
from plane.license.utils.instance_value import get_configuration_value

@shared_task
def project_invitation(email, project_id, token, current_site, invitor):
    try:
        user = User.objects.get(email=invitor)
        project = Project.objects.get(pk=project_id)
        project_member_invite = ProjectMemberInvite.objects.get(
            token=token, email=email
        )

        relativelink = f"/project-invitations/?invitation_id={project_member_invite.id}&email={email}&slug={project.workspace.slug}&project_id={str(project_id)}"
        abs_url = current_site + relativelink

        subject = f"{user.first_name or user.display_name or user.email} invited you to join {project.name} on Plane"

        context = {
            "email": email,
            "first_name": user.first_name,
            "project_name": project.name,
            "invitation_url": abs_url,
        }

        html_content = render_to_string(
            "emails/invitations/project_invitation.html", context
        )

        text_content = strip_tags(html_content)

        project_member_invite.message = text_content
        project_member_invite.save()

        # Configure email connection from the database
        instance_configuration = InstanceConfiguration.objects.filter(key__startswith='EMAIL_').values("key", "value")
        connection = get_connection(
            host=get_configuration_value(instance_configuration, "EMAIL_HOST"),
            port=int(get_configuration_value(instance_configuration, "EMAIL_PORT", "587")),
            username=get_configuration_value(instance_configuration, "EMAIL_HOST_USER"),
            password=get_configuration_value(instance_configuration, "EMAIL_HOST_PASSWORD"),
            use_tls=bool(get_configuration_value(instance_configuration, "EMAIL_USE_TLS", "1")),
        )
        # Initiate email alternatives
        msg = EmailMultiAlternatives(subject=subject, body=text_content, from_email=get_configuration_value(instance_configuration, "EMAIL_FROM"), to=[email], connection=connection)
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        return
    except (Project.DoesNotExist, ProjectMemberInvite.DoesNotExist) as e:
        return
    except Exception as e:
        # Print logs if in DEBUG mode
        if settings.DEBUG:
            print(e)
        capture_exception(e)
        return

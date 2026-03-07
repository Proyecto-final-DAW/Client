import type { OnboardingPort } from '../../../application/ports/OnboardingPort';
import type { OnboardingFormData } from '../../../domain/models/OnboardingFormData';
import type { OnboardingResponse } from '../../../domain/models/OnboardingResponse';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function toPayload(data: OnboardingFormData) {
  return {
    name: data.name.trim(),
    birth_date: data.birthDate,
    sex: data.sex!,
    weight: parseFloat(data.weight),
    height: parseFloat(data.height),
    activity_level: data.activityLevel!,
    goal: data.goal!,
  };
}

export class OnboardingApiAdapter implements OnboardingPort {
  async submitOnboarding(
    data: OnboardingFormData,
    token: string
  ): Promise<OnboardingResponse> {
    const payload = toPayload(data);

    let response: Response;

    try {
      response = await fetch(`${API_URL}/users/onboarding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error(
        'No se pudo conectar con el servidor. Comprueba tu conexión.'
      );
    }

    if (response.status === 400) {
      try {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData.errors));
      } catch (e) {
        if (e instanceof SyntaxError) {
          throw new Error('Error de validación desconocido.');
        }
        throw e;
      }
    }

    if (response.status === 401) {
      throw new Error('Sesión expirada. Inicia sesión de nuevo.');
    }

    if (!response.ok) {
      throw new Error('Error del servidor. Inténtalo de nuevo.');
    }

    try {
      return await response.json();
    } catch {
      throw new Error('La respuesta del servidor no es válida.');
    }
  }
}

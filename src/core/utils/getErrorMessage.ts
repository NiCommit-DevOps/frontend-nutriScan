/**
 * Extrae un mensaje legible del error de Axios, considerando el ErrorResponse
 * uniforme del backend (message / validationErrors).
 */
export function getErrorMessage(error: any, fallback = 'Ocurrió un error inesperado'): string {
  const data = error?.response?.data
  if (!data) {
    return error?.message ? `${fallback} (${error.message})` : fallback
  }
  if (data.validationErrors && typeof data.validationErrors === 'object') {
    const first = Object.values(data.validationErrors)[0]
    if (first) return String(first)
  }
  return data.message || fallback
}

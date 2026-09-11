using LAmour.Api.Models;

namespace LAmour.Api.Services;

/// <summary>
/// Builds a wa.me deep link pre-filled with the appointment details, so the admin can send it to the
/// assigned masseuse in one click. This avoids requiring a WhatsApp Business API account; it can be
/// swapped later for the official Cloud API by replacing BuildAssignmentLink's transport.
/// </summary>
public class WhatsAppLinkService
{
    public string BuildAssignmentLink(Appointment appointment, string masseuseWhatsAppNumber, string masseuseStageName, string serviceName)
    {
        var digits = new string(masseuseWhatsAppNumber.Where(char.IsDigit).ToArray());

        var message =
            $"Hola {masseuseStageName}! Tienes una nueva cita confirmada en L'AMOUR:\n\n" +
            $"Servicio: {serviceName}\n" +
            $"Fecha y hora: {appointment.StartsAt:dddd d 'de' MMMM, h:mm tt}\n" +
            $"Duración: {appointment.DurationMinutes} min\n" +
            $"Cliente: {appointment.ClientName} ({appointment.ClientPhone})\n" +
            $"Dirección: {appointment.Address}, {appointment.Neighborhood}, {appointment.City}\n" +
            (string.IsNullOrWhiteSpace(appointment.AddressDetails) ? "" : $"Detalles dirección: {appointment.AddressDetails}\n") +
            $"Pago: {TranslatePayment(appointment.PaymentMethod)}\n" +
            (appointment.SensoryDressRequested ? "Incluye vestidura sensorial\n" : "") +
            (appointment.ExtraMinutes > 0 ? $"Tiempo adicional: {appointment.ExtraMinutes} min\n" : "") +
            (string.IsNullOrWhiteSpace(appointment.Notes) ? "" : $"Notas: {appointment.Notes}\n") +
            "\nPor favor confirma recibido.";

        var encoded = Uri.EscapeDataString(message);
        return $"https://wa.me/{digits}?text={encoded}";
    }

    private static string TranslatePayment(PaymentMethod method) => method switch
    {
        PaymentMethod.Cash => "Efectivo",
        PaymentMethod.Transfer => "Transferencia",
        PaymentMethod.Card => "Tarjeta (datáfono)",
        _ => method.ToString()
    };
}

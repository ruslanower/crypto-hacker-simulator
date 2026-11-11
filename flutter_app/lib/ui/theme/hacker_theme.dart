import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HackerTheme {
  static const Color background = Color(0xFF070B11);
  static const Color surface = Color(0xFF0F1722);
  static const Color card = Color(0xFF131E2D);
  static const Color neonGreen = Color(0xFF00FF66);
  static const Color neonCyan = Color(0xFF00F0FF);
  static const Color neonAmber = Color(0xFFFFB800);
  static const Color neonRed = Color(0xFFFF2A55);
  static const Color textMuted = Color(0xFF708499);
  static const Color textWhite = Color(0xFFF1F5F9);
  static const Color border = Color(0xFF1E2D3D);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: neonGreen,
      fontFamily: 'monospace',
      fontFamilyFallback: const ['RobotoMono', 'DroidSansMono', 'Courier', 'monospace'],
      colorScheme: const ColorScheme.dark(
        primary: neonGreen,
        secondary: neonCyan,
        surface: surface,
        error: neonRed,
      ),
      textTheme: GoogleFonts.jetBrainsMonoTextTheme(
        ThemeData.dark().textTheme,
      ).apply(
        bodyColor: textWhite,
        displayColor: neonGreen,
        fontFamily: 'monospace',
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.jetBrainsMono(
          color: neonGreen,
          fontSize: 18,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.2,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: surface,
        selectedItemColor: neonGreen,
        unselectedItemColor: textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}

import 'package:flutter_test/flutter_test.dart';
import 'package:crypto_hacker/main.dart';
import 'package:crypto_hacker/providers/game_state.dart';
import 'package:provider/provider.dart';

void main() {
  testWidgets('CryptoHackerApp smoke test - tap terminal increments balance', (WidgetTester tester) async {
    final gameState = GameState();

    await tester.pumpWidget(
      ChangeNotifierProvider<GameState>.value(
        value: gameState,
        child: const CryptoHackerApp(),
      ),
    );

    await tester.pump();

    // Verify initial values
    expect(gameState.tapsCount, 0);

    // Tap the brute force button
    gameState.tapTerminal();
    await tester.pump();

    expect(gameState.tapsCount, 1);
    expect(gameState.cash > 0, true);

    // Dispose timers to clean up test environment
    gameState.dispose();
  });
}

import SwiftUI

struct GlossaryPlaceholderView: View {
    var body: some View {
        NavigationStack {
            Text("术语页占位")
                .font(.system(size: DesignTokens.fontBody))
                .foregroundStyle(DesignTokens.textSecondary)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(DesignTokens.canvas.ignoresSafeArea())
                .navigationTitle("术语")
                .navigationBarTitleDisplayMode(.large)
        }
    }
}

#Preview {
    GlossaryPlaceholderView()
}
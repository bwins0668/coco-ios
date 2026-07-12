import SwiftUI

struct ProfilePlaceholderView: View {
    var body: some View {
        NavigationStack {
            Text("我的页占位")
                .font(.system(size: DesignTokens.fontBody))
                .foregroundStyle(DesignTokens.textSecondary)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(DesignTokens.canvas.ignoresSafeArea())
                .navigationTitle("我的")
                .navigationBarTitleDisplayMode(.large)
        }
    }
}

#Preview {
    ProfilePlaceholderView()
}
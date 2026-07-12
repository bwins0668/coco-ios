import SwiftUI

struct QPTabBar: View {
    let selection: Binding<String>
    let tabs: [(id: String, title: String, systemImage: String)]

    var body: some View {
        HStack(alignment: .center, spacing: 0) {
            ForEach(tabs, id: \.id) { tab in
                Button {
                    selection.wrappedValue = tab.id
                } label: {
                    VStack(spacing: 4) {
                        Image(systemName: tab.systemImage)
                            .font(.system(size: DesignTokens.fontBody, weight: selection.wrappedValue == tab.id ? .semibold : .regular))
                        Text(tab.title)
                            .font(.system(size: DesignTokens.fontLabel, weight: selection.wrappedValue == tab.id ? .semibold : .regular))
                    }
                    .foregroundStyle(selection.wrappedValue == tab.id ? DesignTokens.primary : DesignTokens.textTertiary)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, DesignTokens.space1)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, DesignTokens.space2)
        .padding(.bottom, max(DesignTokens.space1 - 2, 0))
        .padding(.top, DesignTokens.space1)
        .background(
            DesignTokens.surface
                .ignoresSafeArea(edges: .bottom)
                .shadow(color: DesignTokens.lineStrong, radius: 12, x: 0, y: -4)
        )
    }
}
